package fr.polytech.info4.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import fr.polytech.info4.domain.enumeration.SystemPaiment;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Panier.
 */
@Entity
@Table(name = "panier")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Panier implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "method")
    private SystemPaiment method;

    @DecimalMin(value = "0")
    @Column(name = "price")
    private Float price;

    @NotNull
    @Column(name = "is_paid", nullable = false)
    private Boolean isPaid;

    @JsonIgnoreProperties(value = { "panier" }, allowSetters = true)
    @OneToOne
    @JoinColumn(unique = true)
    private Course course;

    @OneToMany(mappedBy = "panier")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "restaurant", "panier" }, allowSetters = true)
    private Set<Produit> produits = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "cooperative", "paniers" }, allowSetters = true)
    private Compte compte;

    @ManyToOne
    @JsonIgnoreProperties(value = { "produits", "paniers", "cooperative" }, allowSetters = true)
    private Restaurant restaurant;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Panier id(Long id) {
        this.id = id;
        return this;
    }

    public SystemPaiment getMethod() {
        return this.method;
    }

    public Panier method(SystemPaiment method) {
        this.method = method;
        return this;
    }

    public void setMethod(SystemPaiment method) {
        this.method = method;
    }

    public Float getPrice() {
        return this.price;
    }

    public Panier price(Float price) {
        this.price = price;
        return this;
    }

    public void setPrice(Float price) {
        this.price = price;
    }

    public Boolean getIsPaid() {
        return this.isPaid;
    }

    public Panier isPaid(Boolean isPaid) {
        this.isPaid = isPaid;
        return this;
    }

    public void setIsPaid(Boolean isPaid) {
        this.isPaid = isPaid;
    }

    public Course getCourse() {
        return this.course;
    }

    public Panier course(Course course) {
        this.setCourse(course);
        return this;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Set<Produit> getProduits() {
        return this.produits;
    }

    public Panier produits(Set<Produit> produits) {
        this.setProduits(produits);
        return this;
    }

    public Panier addProduit(Produit produit) {
        this.produits.add(produit);
        produit.setPanier(this);
        return this;
    }

    public Panier removeProduit(Produit produit) {
        this.produits.remove(produit);
        produit.setPanier(null);
        return this;
    }

    public void setProduits(Set<Produit> produits) {
        if (this.produits != null) {
            this.produits.forEach(i -> i.setPanier(null));
        }
        if (produits != null) {
            produits.forEach(i -> i.setPanier(this));
        }
        this.produits = produits;
    }

    public Compte getCompte() {
        return this.compte;
    }

    public Panier compte(Compte compte) {
        this.setCompte(compte);
        return this;
    }

    public void setCompte(Compte compte) {
        this.compte = compte;
    }

    public Restaurant getRestaurant() {
        return this.restaurant;
    }

    public Panier restaurant(Restaurant restaurant) {
        this.setRestaurant(restaurant);
        return this;
    }

    public void setRestaurant(Restaurant restaurant) {
        this.restaurant = restaurant;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Panier)) {
            return false;
        }
        return id != null && id.equals(((Panier) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Panier{" +
            "id=" + getId() +
            ", method='" + getMethod() + "'" +
            ", price=" + getPrice() +
            ", isPaid='" + getIsPaid() + "'" +
            "}";
    }
}
