package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Restaurant.
 */
@Entity
@Table(name = "restaurant")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Restaurant implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @NotNull
    @Size(min = 3)
    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "open_time")
    private Instant openTime;

    @Column(name = "close_time")
    private Instant closeTime;

    @OneToMany(mappedBy = "restaurant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "restaurant", "panier" }, allowSetters = true)
    private Set<Produit> produits = new HashSet<>();

    @OneToMany(mappedBy = "restaurant")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "course", "produits", "compte", "restaurant" }, allowSetters = true)
    private Set<Panier> paniers = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "restaurants", "compte" }, allowSetters = true)
    private Cooperative cooperative;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Restaurant id(Long id) {
        this.id = id;
        return this;
    }

    public String getName() {
        return this.name;
    }

    public Restaurant name(String name) {
        this.name = name;
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Instant getOpenTime() {
        return this.openTime;
    }

    public Restaurant openTime(Instant openTime) {
        this.openTime = openTime;
        return this;
    }

    public void setOpenTime(Instant openTime) {
        this.openTime = openTime;
    }

    public Instant getCloseTime() {
        return this.closeTime;
    }

    public Restaurant closeTime(Instant closeTime) {
        this.closeTime = closeTime;
        return this;
    }

    public void setCloseTime(Instant closeTime) {
        this.closeTime = closeTime;
    }

    public Set<Produit> getProduits() {
        return this.produits;
    }

    public Restaurant produits(Set<Produit> produits) {
        this.setProduits(produits);
        return this;
    }

    public Restaurant addProduit(Produit produit) {
        this.produits.add(produit);
        produit.setRestaurant(this);
        return this;
    }

    public Restaurant removeProduit(Produit produit) {
        this.produits.remove(produit);
        produit.setRestaurant(null);
        return this;
    }

    public void setProduits(Set<Produit> produits) {
        if (this.produits != null) {
            this.produits.forEach(i -> i.setRestaurant(null));
        }
        if (produits != null) {
            produits.forEach(i -> i.setRestaurant(this));
        }
        this.produits = produits;
    }

    public Set<Panier> getPaniers() {
        return this.paniers;
    }

    public Restaurant paniers(Set<Panier> paniers) {
        this.setPaniers(paniers);
        return this;
    }

    public Restaurant addPanier(Panier panier) {
        this.paniers.add(panier);
        panier.setRestaurant(this);
        return this;
    }

    public Restaurant removePanier(Panier panier) {
        this.paniers.remove(panier);
        panier.setRestaurant(null);
        return this;
    }

    public void setPaniers(Set<Panier> paniers) {
        if (this.paniers != null) {
            this.paniers.forEach(i -> i.setRestaurant(null));
        }
        if (paniers != null) {
            paniers.forEach(i -> i.setRestaurant(this));
        }
        this.paniers = paniers;
    }

    public Cooperative getCooperative() {
        return this.cooperative;
    }

    public Restaurant cooperative(Cooperative cooperative) {
        this.setCooperative(cooperative);
        return this;
    }

    public void setCooperative(Cooperative cooperative) {
        this.cooperative = cooperative;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Restaurant)) {
            return false;
        }
        return id != null && id.equals(((Restaurant) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Restaurant{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", openTime='" + getOpenTime() + "'" +
            ", closeTime='" + getCloseTime() + "'" +
            "}";
    }
}
