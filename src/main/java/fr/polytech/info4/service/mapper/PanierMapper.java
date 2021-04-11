package fr.polytech.info4.service.mapper;

import fr.polytech.info4.domain.*;
import fr.polytech.info4.service.dto.PanierDTO;
import org.mapstruct.*;

/**
 * Mapper for the entity {@link Panier} and its DTO {@link PanierDTO}.
 */
@Mapper(componentModel = "spring", uses = { CourseMapper.class, CompteMapper.class, RestaurantMapper.class })
public interface PanierMapper extends EntityMapper<PanierDTO, Panier> {
    @Mapping(target = "course", source = "course", qualifiedByName = "id")
    @Mapping(target = "compte", source = "compte", qualifiedByName = "id")
    @Mapping(target = "restaurant", source = "restaurant", qualifiedByName = "id")
    PanierDTO toDto(Panier s);

    @Named("id")
    @BeanMapping(ignoreByDefault = true)
    @Mapping(target = "id", source = "id")
    PanierDTO toDtoId(Panier panier);
}
